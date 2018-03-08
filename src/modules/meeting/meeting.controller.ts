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
                .leftJoin("person_meeting.animalMeetings", "animal_meetings")
                .innerJoin("person_meeting.eventAttender", "event_attender")
                .innerJoinAndSelect("event_attender.adopter", "adopter")
                .leftJoinAndSelect("animal_meetings.animal", "animal")
                .where("person_meeting.id = :personMeetingId", {personMeetingId})
                .andWhere("animal_meetings.active = true")
                .andWhere("person_meeting.concludedAt IS NULL")
                .getOne()
        );
    }

    @Get(":id/details")
    getFullDetails(@Param("id") personMeetingId: number): Observable<PersonMeeting> {
        return Observable.fromPromise(
            PersonMeeting.createQueryBuilder("person_meeting")
                .innerJoin("person_meeting.eventAttender", "event_attender")
                .innerJoinAndSelect("event_attender.event", "event")
                .innerJoinAndSelect("event_attender.adopter", "adopter")
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
                    PersonMeeting.findOneById(personMeetingId, {relations: ["event"]}).then((meeting) =>
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
    endCurrentAnimalMeetingForAdopter(@Param("id") personMeetingId: number, @Body("authorizedUser") adoptionCounselor: User): Observable<AnimalMeeting> {
        return Observable.fromPromise(
            AnimalMeeting.findOne({personMeeting: personMeetingId, active: true} as any)
            .then((meeting) => meeting.end())
            .then((meeting) => {
                PersonMeeting.findOneById(personMeetingId, {relations: ["event"]}).then((meeting) =>
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
                    personMeeting.eventAttender.then((eventAttender) => eventAttender.event.then((event) =>
                        this.eventSocket.updateAnimalsAtEvent(event.id)
                    ));
                    return PersonMeeting.updateById(personMeetingId, {concludedAt: new Date()})
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
                    return PersonMeeting.updateById(personMeetingId, {concludedAt: new Date()})
                        .then(() => {
                            return {
                                success: true,
                            };
                        });
                })
        );
    }
}
