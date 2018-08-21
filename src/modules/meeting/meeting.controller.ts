import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';

import { Observable } from "rxjs";
import * as _ from "lodash";
import * as moment from "moment";

import { AnimalsService } from "../animals/animals.service";
import { EventSocket } from "../event/event.socket";

import { User } from "../user/user.entity";
import { Adopter, Animal, PersonMeeting, AnimalMeeting } from "../entities";

@Controller("/meetings")
export class MeetingController {
    constructor(private animalsService: AnimalsService, private eventSocket: EventSocket) { }

    @Get(":id")
    getMeeting(@Param("id") personMeetingId: number): Observable<PersonMeeting> {
        return Observable.fromPromise(
            PersonMeeting.createQueryBuilder("person_meeting")
                .innerJoin("person_meeting.adopter", "adopter")
                .innerJoin("adopter.eventAttendance", "event_attendance")
                .leftJoin("adopter.animalMeetings", "animal_meetings")
                .leftJoinAndSelect("animal_meetings.animal", "animal")
                .where("person_meeting.id = :personMeetingId", {personMeetingId})
                .andWhere("person_meeting.concludedAt IS NULL")
                .andWhere("event_attendance.event_id = person_meeting.event_id")
                .andWhere("animal_meetings.id IS NULL OR (animal_meetings.active = true AND animal_meetings.event_id = person_meeting.event_id)")
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
    startMeetingWithAdopter(@Param("id") personMeetingId: number, @Body("animal_id") animalId: number): Observable<AnimalMeeting> {
        return Observable.fromPromise(
            AnimalMeeting.createQueryBuilder()
                .insert()
                .values({
                    personMeeting: personMeetingId,
                    animal: animalId,
                } as any)
                .execute().then(() => {
                    PersonMeeting.findOne({id: personMeetingId}, {relations: ["event"]}).then((meeting) =>
                        this.eventSocket.updateAnimalsAtEvent((meeting as any).__event__.id)
                    );
                    return AnimalMeeting.findOne({
                        active: true,
                        animal: animalId,
                    } as any)
                })
        );
    }

    @Post(":id/end_animal_meeting")
    endCurrentAnimalMeetingForAdopter(@Param("id") personMeetingId: number, @Body("currentUser") adoptionCounselor: User): Observable<AnimalMeeting> {
        return Observable.fromPromise(
            AnimalMeeting.findOne({personMeeting: personMeetingId, active: true} as any)
            .then((meeting) => {
                meeting.concludedAt = new Date();
                return meeting.save();
            })
            .then((meeting) => {
                PersonMeeting.findOne({id: personMeetingId}, {relations: ["event"]}).then((meeting) =>
                    this.eventSocket.updateAnimalsAtEvent((meeting as any).__event__.id)
                );

                return meeting;
            })
        );
    }

    @Post(":id/adopt")
    adoptAnimalToAdopter(@Param("id") personMeetingId: number): Observable<{success: boolean, error?: string}> {
        return Observable.fromPromise(
            PersonMeeting.createQueryBuilder("person_meeting")
                .innerJoinAndSelect("person_meeting.animalMeetings", "animal_meetings")
                .where("animal_meetings.active = true")
                .andWhere("person_meeting.id = :personMeetingId", {personMeetingId})
                .andWhere("person_meeting.concludedAt IS NULL")
                .getOne().then(personMeeting => {
                    if(!personMeeting) {
                        return {
                            success: false,
                            error: "Could not find animal for meeting",
                        };
                    }

                    personMeeting.event.then((event) => this.eventSocket.updateAnimalsAtEvent(event.id));

                    return PersonMeeting.update({id: personMeetingId}, {concludedAt: new Date()})
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
                .innerJoin("person_meeting.animalMeetings", "animal_meetings")
                .where("animal_meetings.active = true")
                .andWhere("person_meeting.id = :personMeetingId", {personMeetingId})
                .andWhere("person_meeting.concludedAt IS NULL")
                .getOne()
                .then((personMeeting) => {
                    if(personMeeting) {
                        return {
                            success: false,
                            error: "Adopter still has a meeting going!",
                        };
                    }
                    return PersonMeeting.update({id: personMeetingId}, {concludedAt: new Date()})
                        .then(() => {
                            return {
                                success: true,
                            };
                        });
                })
        );
    }
}
