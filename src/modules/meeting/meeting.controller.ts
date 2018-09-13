import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';

import { Observable } from "rxjs";
import * as _ from "lodash";
import * as moment from "moment";

import { AnimalsService } from "../animals/animals.service";
import { EventSocket } from "../event/event.socket";

import { User } from "../user/user.entity";
import { Adopter, Animal, PersonMeeting, AnimalMeeting, EventAttendance } from "../entities";

@Controller("/meetings")
export class MeetingController {
    constructor(private animalsService: AnimalsService, private eventSocket: EventSocket) { }

    @Get(":id")
    getMeeting(@Param("id") personMeetingId: number): Observable<PersonMeeting> {
        return Observable.fromPromise(
            PersonMeeting.createQueryBuilder("person_meeting")
                .innerJoinAndSelect("person_meeting.adopter", "adopter")
                .innerJoinAndSelect("adopter.eventAttendances", "event_attendance", "event_attendance.event_id = person_meeting.event_id")
                .leftJoinAndSelect("adopter.animalMeetings", "animal_meetings", "animal_meetings.event_id = person_meeting.event_id")
                .leftJoinAndSelect("animal_meetings.animal", "animal")
                .where("person_meeting.id = :personMeetingId", {personMeetingId})
                .andWhere("person_meeting.concludedAt IS NULL")
                .andWhere("(animal_meetings.id IS NULL OR animal_meetings.active OR animal_meetings.adopted)")
                .getOne()
        );
    }

    @Get(":id/details")
    getFullDetails(@Param("id") personMeetingId: number): Observable<PersonMeeting> {
        return Observable.fromPromise(
            PersonMeeting.createQueryBuilder("person_meeting")
                .innerJoinAndSelect("person_meeting.event", "event")
                .innerJoinAndSelect("person_meeting.adopter", "adopter")
                .innerJoinAndSelect("person_meeting.adoptionCounselor", "adoptionCounselor")
                .where("person_meeting.id = :personMeetingId", {personMeetingId})
                .getOne()
        );
    }

    @Post(":id")
    startMeetingWithAdopter(@Param("id") personMeetingId: number, @Body("animal_id") animalId: number, @Body("currentUser") adoptionCounselor: User): Observable<AnimalMeeting> {
        return Observable.fromPromise(
            PersonMeeting.findOne({id: personMeetingId}, {relations: ["event", "adopter"]})
            .then(meeting => AnimalMeeting.createQueryBuilder()
                .insert()
                .values({
                    event: (meeting as any).__event__,
                    adopter: (meeting as any).__adopter__,
                    animal: animalId,
                    adoptionCounselor,
                } as any)
                .execute()
                .then(() => this.eventSocket.updateAnimalsAtEvent((meeting as any).__event__.id))
            ).then(() => AnimalMeeting.findOne({
                    active: true,
                    animal: animalId,
                } as any))
        );
    }

    @Post(":id/end_animal_meeting")
    async endCurrentAnimalMeetingForAdopter(@Param("id") personMeetingId: number, @Body("currentUser") adoptionCounselor: User): Promise<AnimalMeeting> {
        let personMeeting = await PersonMeeting.findOne(personMeetingId, {relations: ["event", "adopter"]});

        let animalMeeting = await AnimalMeeting.findOne({adoptionCounselor, event: (personMeeting as any).__event__, adopter: (personMeeting as any).__adopter__, active: true, concludedAt: null} as any);

        animalMeeting = _.extend(animalMeeting, {concludedAt: new Date(), active: null, adopted: false});

        await animalMeeting.save();

        this.eventSocket.updateAnimalsAtEvent((personMeeting as any).__event__.id);

        return animalMeeting;
    }

    @Post(":id/adopt")
    adoptAnimalToAdopter(@Param("id") personMeetingId: number, @Body("currentUser") adoptionCounselor: User): Observable<{success: boolean, error?: string}> {
        return Observable.fromPromise(
            PersonMeeting.createQueryBuilder("person_meeting")
                .innerJoin("person_meeting.adopter", "adopters")
                .innerJoin("adopters.animalMeetings", "animal_meeting")
                .where("animal_meeting.active = true")
                .andWhere("animal_meeting.concludedAt IS NULL")
                .andWhere("person_meeting.id = :personMeetingId", {personMeetingId})
                .andWhere("person_meeting.concludedAt IS NULL")
                .andWhere("animal_meeting.event = person_meeting.event")
                .andWhere("animal_meeting.adoptionCounselor = person_meeting.adoptionCounselor")
                .getOne().then(async (personMeeting) => {
                    if(!personMeeting) {
                        return {
                            success: false,
                            error: "Could not find animal for meeting",
                        };
                    }

                    personMeeting = await PersonMeeting.findOne(personMeeting.id, {relations: ["event", "adopter"]});
                    let event = (personMeeting as any).__event__;
                    let adopter = (personMeeting as any).__adopter__;

                    let concludedAt = new Date();
                    let eventSave = EventAttendance.findOne({event, adopter})
                        .then(eventAttendance => _.extend(eventAttendance, {concludedAt}).save());

                    let animalMeetingSave = AnimalMeeting.findOne({adoptionCounselor, event, adopter, active: true, concludedAt: null} as any)
                        .then(animalMeeting => _.extend(animalMeeting, {concludedAt, active: null, adopted: true}).save());

                    let meetingSave = _.extend(personMeeting, {concludedAt}).save();

                    return Promise.all([meetingSave, eventSave, animalMeetingSave])
                        .then(() => this.eventSocket.updateAnimalsAtEvent(event.id))
                        .then(() => {
                            return {
                                success: true,
                            };
                        });
                })
        );
    }

    @Post(":id/end")
    endMeetingWithAdopter(@Param("id") personMeetingId: number): Observable<{success: boolean, error?: string}> {
        return Observable.fromPromise(
            PersonMeeting.createQueryBuilder("person_meeting")
                .innerJoin("person_meeting.adopter", "adopters")
                .innerJoin("adopters.animalMeetings", "animal_meeting")
                .where("animal_meeting.active = true")
                .andWhere("animal_meeting.active")
                .andWhere("person_meeting.id = :personMeetingId", {personMeetingId})
                .andWhere("person_meeting.concludedAt IS NULL")
                .andWhere("animal_meeting.event = person_meeting.event")
                .andWhere("animal_meeting.adoptionCounselor = person_meeting.adoptionCounselor")
                .getOne()
                .then((personMeeting) => {
                    if(personMeeting) {
                        return {
                            success: false,
                            error: "Adopter still has a meeting going!",
                        };
                    }
                    return PersonMeeting.findOne({id: personMeetingId}, {relations: ["event", "adopter"]})
                        .then(meeting => _.extend(meeting, {concludedAt: new Date()}).save())
                        .then(meeting => EventAttendance.findOne({event: meeting.__event__, adopter: meeting.__adopter__}))
                        .then(eventAttendance => _.extend(eventAttendance, {concludedAt: new Date()}).save())
                        .then(() => {

                            return {
                                success: true,
                            };
                        });
                })
        );
    }
}
