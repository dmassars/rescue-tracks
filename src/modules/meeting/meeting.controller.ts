import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';

import { Observable } from "rxjs";
import * as _ from "lodash";
import * as moment from "moment";

import { AnimalsService } from "../animals/animals.service";

import { User } from "../user/user.entity";
import { Adopter, Animal, PersonMeeting, AnimalMeeting } from "../entities";

@Controller("/meetings")
export class MeetingController {
    constructor(private animalsService: AnimalsService) { }

    @Get(":id")
    getMeeting(@Param("id") personMeetingId: number): Observable<PersonMeeting> {
        return Observable.fromPromise(
            PersonMeeting.createQueryBuilder("person_meeting")
                .innerJoin("person_meeting.event", "event")
                .leftJoin("person_meeting.animalMeetings", "animal_meetings")
                .innerJoinAndSelect("person_meeting.adopter", "adopter")
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
                .innerJoinAndSelect("person_meeting.event", "event")
                .innerJoinAndSelect("person_meeting.adopter", "adopter")
                .innerJoinAndSelect("person_meeting.adoptionCounselor", "adoptionCounselor")
                .innerJoinAndSelect("event.animals", "animals")
                .leftJoinAndSelect("animals.animalMeetings", "animal_meetings", "animal_meetings.active = true")
                .leftJoinAndSelect("animal_meetings.personMeeting", "person_meetings")
                .leftJoinAndSelect("person_meetings.adoptionCounselor", "otherAdoptionCounselors")
                .leftJoinAndSelect("person_meetings.adopter", "otherAdopters")
                .where("person_meeting.id = :personMeetingId", {personMeetingId})
                .orderBy("animals.name", "ASC")
                .getOne()
        );
    }

    @Post(":id")
    startMeetingWithAdopter(@Param("id") personMeetingId: number, @Body("animal_id") animalId: number): Observable<AnimalMeeting> {
        return Observable.fromPromise(
            AnimalMeeting.createQueryBuilder()
                .insert()
                .values({
                    attender: personMeetingId,
                    animal: animalId,
                } as any)
                .execute().then(() =>
                    AnimalMeeting.findOne({
                        _active: true,
                        animal: animalId,
                    } as any)
                )
        );
    }

    @Post(":id/end_animal_meeting")
    endCurrentAnimalMeetingForAdopter(@Param("id") personMeetingId: number, @Body("authorizedUser") adoptionCounselor: User): Observable<AnimalMeeting> {
        return Observable.fromPromise(
            AnimalMeeting.findOne({attender: personMeetingId, _active: true} as any)
            .then((meeting) => meeting.end())
        );
    }

    @Post(":id/adopt")
    adoptAnimalToAdopter(@Param("id") personMeetingId: number): Observable<{success: boolean, error?: string}> {
        return Observable.fromPromise(
            PersonMeeting.createQueryBuilder("person_meeting")
                .where("person_meeting.id = :personMeetingId", {personMeetingId})
                .innerJoinAndSelect("person_meeting.animalMeetings", "animal_meetings")
                .innerJoinAndSelect("animal_meetings.animal", "animals")
                .where("animal_meetings.active = true")
                .andWhere("person_meeting.concludedAt IS NULL")
                .getOne().then(eventAttendance => {
                    if(!eventAttendance) {
                        return {
                            success: false,
                            error: "Could not find animal for meeting",
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

    @Post(":id/end")
    endMeetingWithAdopter(@Param("id") personMeetingId: number): Observable<{success: boolean, error?: string}> {
        return Observable.fromPromise(
            PersonMeeting.createQueryBuilder("person_meeting")
                .where("person_meeting.id = :personMeetingId", {personMeetingId})
                .innerJoin("person_meeting.animalMeetings", "animal_meetings")
                .where("animal_meetings.active = true")
                .andWhere("person_meeting.concludedAt IS NULL")
                .getOne().then((eventAttendance) => {
                    if(eventAttendance) {
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
