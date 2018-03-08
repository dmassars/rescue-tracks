import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';

import { Observable } from "rxjs";
import * as _ from "lodash";
import * as moment from "moment";

import { EventSocket } from "./event.socket";
import { EventService } from "./event.service";

import { AnimalsService } from "../animals/animals.service";

import { EventEntity } from "./event.entity";
import { User } from "../user/user.entity";
import { Adopter, Animal, EventAttender, PersonMeeting } from "../entities";

@Controller("/events")
export class EventController {

    constructor(private animalsService: AnimalsService, private eventSocket: EventSocket, private eventService: EventService) { }

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

    @Get(":id/animals-for-meeting")
    getAnimalsForMeetings(@Param("id") eventId: number): Observable<Animal[]> {
        return Observable.fromPromise(
            this.eventService.getAnimalsAtEvent(eventId)
        );
    }

    @Get(":id/attendance")
    getPersonMeeting(@Param("id") eventId: number): Observable<EventAttender[]> {
        return Observable.fromPromise(
            this.eventService.getAdoptersWaitingAtEvent(eventId)
        );
    }

    @Post(":id/attendance")
    async addAttendeeToEvent(@Param("id") eventId: number, @Body("attendee") attendee: Adopter): Promise<void> {
        let [event, adopter] = await Promise.all([
                EventEntity.findOneById(eventId, {relations: ["eventAttenders"]}),
                Adopter.findOne({email: attendee.email})
            ]);
        let meetings = await event.eventAttenders;

        if(!adopter) {
            adopter = await Object.assign(new Adopter(), attendee).save();
        }

        let newEventAttender = Object.assign(new EventAttender(), {adopter, event});

        meetings.push(newEventAttender);

        newEventAttender.save()
            .then(() => event.save())
            .then(() => this.eventSocket.updateAdoptersAtEvent(eventId));
    }

    @Put(":id/attendance")
    assignAdoptionCounselor(@Param("id") eventId: number, @Body("authorizedUser") adoptionCounselor: User, @Body("attendee") attendee: Adopter): Observable<PersonMeeting> {
        return Observable.fromPromise(
            EventAttender.findOne({where: {event_id: eventId, adopter_id: attendee.id}})
            .then((eventAttender: EventAttender) => {
                let newPersonMeeting = Object.assign(new PersonMeeting, {eventAttender, adoptionCounselor});

                return newPersonMeeting.save().then(() => {
                    this.eventSocket.updateAdoptersAtEvent(eventId);
                    return newPersonMeeting;
                });
            })
        );
    }

    @Get(":id/meetings")
    getMeetingsAtEvent(@Param("id") eventId: number, @Body("authorizedUser") adoptionCounselor: User): Observable<PersonMeeting[]> {
        return Observable.fromPromise(
            PersonMeeting.createQueryBuilder("person_meeting")
                .innerJoin("person_meeting.eventAttender", "event_attender")
                .innerJoinAndSelect("event_attender.adopter", "adopter")
                .leftJoinAndSelect("person_meeting.animalMeetings", "animal_meetings", "animal_meetings.active = true")
                .leftJoinAndSelect("animal_meetings.animal", "animal")
                .where("event_attender.event_id = :eventId", {eventId})
                .andWhere("event_attender.active")
                .andWhere("person_meeting.adoption_counselor_id = :adoptionCounselorId", {adoptionCounselorId: adoptionCounselor.id})
                .andWhere("person_meeting.concluded_at IS NULL")
                .orderBy("person_meeting.created_at", "DESC")
                .getMany()
        );
    }
}
