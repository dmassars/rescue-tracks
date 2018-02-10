import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';

import { Observable } from "rxjs";
import * as _ from "lodash";
import * as moment from "moment";

import { AnimalsService } from "../animals/animals.service";

import { User } from "../user/user.entity";
import { Adopter, Animal, EventAttendance, Meeting } from "../entities";

@Controller("/meetings")
export class MeetingController {
    constructor(private animalsService: AnimalsService) { }

    @Get(":id")
    getMeeting(@Param("id") eventAttendanceId: number): Observable<EventAttendance> {
        return Observable.fromPromise(
            EventAttendance.createQueryBuilder("ea")
                .innerJoin("ea.event", "event")
                .leftJoin("ea.meetings", "meetings")
                .innerJoinAndSelect("ea.adopter", "adopter")
                .leftJoinAndSelect("meetings.animal", "animal")
                .where("ea.id = :eventAttendanceId", {eventAttendanceId})
                .andWhere("ea.concludedAt IS NULL")
                .andWhere("meetings.active = true OR meetings.id IS NULL")
                .getOne()
        );
    }

    @Get(":id/details") // Important - ID here is actually for the eventAttendance
    getFullDetails(@Param("id") eventAttendanceId: number): Observable<EventAttendance> {
        return Observable.fromPromise(
            EventAttendance.createQueryBuilder("ea")
                .innerJoinAndSelect("ea.event", "event")
                .innerJoinAndSelect("ea.adopter", "adopter")
                .innerJoinAndSelect("ea.adoptionCounselor", "adoptionCounselor")
                .innerJoinAndSelect("event.animals", "animals")
                .leftJoinAndSelect("animals.meetings", "meetings", "meetings.active = true")
                .leftJoinAndSelect("meetings.attender", "attenders")
                .leftJoinAndSelect("attenders.adoptionCounselor", "otherAdoptionCounselors")
                .leftJoinAndSelect("attenders.adopter", "otherAdopters")
                .where("ea.id = :eventAttendanceId", {eventAttendanceId})
                .orderBy("animals.name", "ASC")
                .getOne()
        );
    }

    @Post(":id")
    startMeetingWithAdopter(@Param("id") eventAttendanceId: number, @Body("animal_id") animalId: number): Observable<Meeting> {
        return Observable.fromPromise(
            Meeting.createQueryBuilder()
                .insert()
                .values({
                    attender: eventAttendanceId,
                    animal: animalId,
                } as any)
                .execute().then(() =>
                    Meeting.findOne({
                        _active: true,
                        animal: animalId,
                    } as any)
                )
        );
    }

    @Post(":id/end")
    endCurrentMeetingForAdopter(@Param("id") eventAttendanceId: number, @Body("authorizedUser") adoptionCounselor: User): Observable<Meeting> {
        return Observable.fromPromise(
            Meeting.findOne({attender: eventAttendanceId, _active: true} as any)
            .then((meeting) => meeting.end())
        );
    }
}

