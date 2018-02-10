import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';

import { Observable } from "rxjs";
import * as _ from "lodash";
import * as moment from "moment";

import { AnimalsService } from "../animals/animals.service";

import { EventEntity } from "./event.entity";
import { User } from "../user/user.entity";
import { Adopter, Animal, EventAttendance } from "../entities";

@Controller("/events")
export class EventController {

    constructor(private animalsService: AnimalsService) { }

    @Get("/")
    getEvents(): Observable<EventEntity[]> {
        return Observable.fromPromise(EventEntity.find({relations: ["animals"]}));
    }

    @Post("/")
    createEvent(@Body() event: EventEntity): Observable<EventEntity> {
        return Observable.fromPromise(Object.assign(new EventEntity(), event).save());
    }

    @Get(":id")
    getEvent(@Param("id") eventId: number): Observable<EventEntity> {
        return Observable.fromPromise(EventEntity.findOneById(eventId, {relations: ["animals"]}));
    }

    @Put(":id")
    editEvent(@Param("id") eventId: number, @Body() eventDetails: {animals: number[]}): Observable<EventEntity> {
        return Observable.fromPromise(Promise.all([
            EventEntity.findOneById(eventId),
            (() => {
                if(eventDetails.animals.length) {
                    return this.animalsService.getRemoteAnimals(eventDetails.animals);
                } else {
                    return [];
                }
            })(),
        ]).then(([event, animals]) => {
            event.animals = Promise.resolve(animals);

            return event.save();
        }));
    }

    @Get(":id/animals")
    async getAnimalsForEvent(@Param("id") eventId: number, @Query("all") getAll: boolean): Promise<Animal[]> {
        getAll = !!getAll;
        let event: EventEntity = await EventEntity.findOneById(eventId);

        let selectedAnimals: Animal[] = await event.animals;

        if(moment(event.endTime).isBefore(moment()) || !getAll) {
            return _.map(selectedAnimals, (animal: Animal) =>
                        _.merge(animal, {selected: true})
                    );
        }

        let allAnimals: Animal[] = await this.animalsService.getRemoteAnimals();

        return _.chain(selectedAnimals)
                .map((animal: Animal) => _.merge(animal, {selected: true}))
                .unionBy(allAnimals, (animal: Animal) => animal.externalId)
                .sortBy((animal: Animal) => animal.name)
                .value();
    }

    @Get(":id/attendance")
    getEventAttendance(@Param("id") eventId: number): Observable<Adopter[]> {
        return Observable.fromPromise(
            EventAttendance.createQueryBuilder("event_attendance")
                .innerJoinAndSelect("event_attendance.adopter", "adopter")
                .where("event_attendance.adoption_counselor_id IS NULL")
                .andWhere("event_attendance.event_id = :eventId", {eventId})
                .orderBy("event_attendance.created_at", "ASC")
                .getMany()
                .then(attendance => Promise.all<Adopter>(
                    _.map(attendance, "adopter")
                ))
        );
    }

    @Post(":id/attendance")
    async addAttendeeToEvent(@Param("id") eventId: number, @Body("attendee") attendee: Adopter): Promise<Adopter> {
        let [event, adopter] = await Promise.all([
                EventEntity.findOneById(eventId, {relations: ["eventAttendance"]}),
                Adopter.findOne({email: attendee.email})
            ]);
        let attendance = await event.eventAttendance;

        if(!adopter) {
            adopter = await Object.assign(new Adopter(), attendee).save();
        }

        let newAttendance = Object.assign(new EventAttendance(), {adopter});

        attendance.push(newAttendance);

        event.save();
        newAttendance.save();

        return adopter;
    }

    @Put(":id/attendance")
    assignAdoptionCounselor(@Param("id") eventId: number, @Body("authorizedUser") adoptionCounselor: User, @Body("attendee") attendee: Adopter): Observable<EventAttendance> {
        return Observable.fromPromise(
            EventAttendance.createQueryBuilder()
                .update()
                .where("event_id = :eventId", {eventId})
                .andWhere("adopter_id = :adopterId", {adopterId: attendee.id})
                .set({adoptionCounselor: adoptionCounselor.id})
                .execute()
            .then(() => {
                return EventAttendance.createQueryBuilder()
                    .where("event_id = :eventId", {eventId})
                    .andWhere("adopter_id = :adopterId", {adopterId: attendee.id})
                    .andWhere("adoption_counselor_id = :adoptionCounselorId", {adoptionCounselorId: adoptionCounselor.id})
                    .getOne();
            })
        );
    }

    @Get(":id/meetings")
    getMeetingsAtEvent(@Param("id") eventId: number, @Body("authorizedUser") adoptionCounselor: User): Observable<EventAttendance[]> {
        return Observable.fromPromise(
            EventAttendance.createQueryBuilder("ea")
                .innerJoinAndSelect("ea.adopter", "adopter")
                .leftJoinAndSelect("ea.meetings", "meetings", "meetings.active = true")
                .leftJoinAndSelect("meetings.animal", "animal")
                .where("ea.event_id = :eventId", {eventId})
                .andWhere("ea.adoption_counselor_id = :adoptionCounselorId", {adoptionCounselorId: adoptionCounselor.id})
                .andWhere("ea.concluded_at IS NULL")
                .orderBy("ea.created_at", "DESC")
                .getMany()
        );
    }
}
