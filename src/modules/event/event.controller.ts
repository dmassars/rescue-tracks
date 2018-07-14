import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';

import { Observable } from "rxjs";
import * as _ from "lodash";
import * as moment from "moment";

import { EventSocket } from "./event.socket";
import { EventService } from "./event.service";

import { OrganizationEventGuard } from "./organization-event.guard";

import { AnimalsService } from "../animals/animals.service";

import {
    PermissibleAction,
    RequiredPermission
} from "../user/required-permission.guard";

import { EventEntity } from "./event.entity";
import { EventPersonnel } from "./event-personnel.entity";
import { User } from "../user/user.entity";
import { Organization } from "../organization/organization.entity";
import { Adopter, Animal, EventAttendance, PersonMeeting } from "../entities";

@Controller("/events")
export class EventController {

    constructor(private animalsService: AnimalsService, private eventSocket: EventSocket, private eventService: EventService) { }

    @Get("/")
    getEvents(@Body("currentOrganization") organization: Organization, @Query("active") active: boolean): Observable<EventEntity[]> {
        let events = EventEntity.createQueryBuilder("events")
                                .loadRelationCountAndMap("events.animalCount", "events.animals")
                                .where("events.organization = :organization", {organization: organization.id})
                                .orderBy("events.startTime", "DESC")

        if (active) {
            events = events.andWhere("NOW() BETWEEN events.startTime AND events.endTime");
        }

        return Observable.fromPromise(events.getMany());
    }

    @Post("/")
    createEvent(@Body() event: EventEntity, @Body("currentOrganization") organization: Organization): Observable<EventEntity> {
        return Observable.fromPromise(
            (new EventEntity(Object.assign(event, {organization}))).save()
        );
    }

    @Get(":id")
    @RequiredPermission(PermissibleAction.VIEW_CURRENT_ATTENDANCE, PermissibleAction.MANAGE_MEETINGS)
    @RequiredPermission(PermissibleAction.CREATE_EVENT)
    @UseGuards(OrganizationEventGuard)
    getEvent(@Param("id") eventId: number): Observable<EventEntity> {
        return Observable.fromPromise(EventEntity.findOne({id: eventId}, {relations: ["animals"]}));
    }

    @Put(":id")
    @UseGuards(OrganizationEventGuard)
    editEvent(@Param("id") eventId: number, @Body() eventDetails: {animals: number[]}): Observable<EventEntity> {
        return Observable.fromPromise(Promise.all([
            EventEntity.findOne({id: eventId}),
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

    @Post(":id/join")
    @UseGuards(OrganizationEventGuard)
    joinEvent(@Param("id") eventId: number, @Body("currentUser") personnel: User): Observable<EventPersonnel> {
        return Observable.fromPromise(
            (new EventPersonnel({
                personnel,
                event: EventEntity.findOne({id: eventId}),
            })).save()
        );
    }

    @Get(":id/animals")
    @UseGuards(OrganizationEventGuard)
    async getAnimalsForEvent(@Param("id") eventId: number, @Query("all") getAll: boolean): Promise<Animal[]> {
        getAll = !!getAll;
        let event: EventEntity = await EventEntity.findOne({id: eventId});

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
    @UseGuards(OrganizationEventGuard)
    getAnimalsForMeetings(@Param("id") eventId: number): Observable<Animal[]> {
        return Observable.fromPromise(
            this.eventService.getAnimalsAtEvent(eventId)
        );
    }

    @Get(":id/attendance")
    @UseGuards(OrganizationEventGuard)
    getPersonMeeting(@Param("id") eventId: number): Observable<EventAttendance[]> {
        return Observable.fromPromise(
            this.eventService.getAdoptersWaitingAtEvent(eventId)
        );
    }

    @Post(":id/attendance")
    @UseGuards(OrganizationEventGuard)
    async addAttendeeToEvent(@Param("id") eventId: number, @Body("attendee") attendee: Adopter): Promise<void> {
        let [event, adopter] = await Promise.all([
                EventEntity.findOne({id: eventId}, {relations: ["eventAttendances"]}),
                Adopter.createQueryBuilder("adopters")
                       .where("adopters.email = :email", {email: attendee.email})
                       .orWhere("adopters.phoneNumber = :phoneNumber", {phoneNumber: attendee.phoneNumber})
                       .getOne()
            ]);
        let meetings = await event.eventAttendances;

        if(!adopter) {
            adopter = await Object.assign(new Adopter(), attendee).save();
        }

        let newEventAttendance = Object.assign(new EventAttendance(), {adopter, event});

        meetings.push(newEventAttendance);

        newEventAttendance.save()
            .then(() => event.save())
            .then(() => this.eventSocket.updateAdoptersAtEvent(eventId));
    }

    @Put(":id/attendance")
    @UseGuards(OrganizationEventGuard)
    assignAdoptionCounselor(@Param("id") eventId: number, @Body("currentUser") adoptionCounselor: User, @Body("attendee") attendee: Adopter): Observable<PersonMeeting> {
        return Observable.fromPromise(
            EventAttendance.findOne({where: {event_id: eventId, adopter_id: attendee.id}})
            .then((eventAttendance: EventAttendance) => {
                let newPersonMeeting = Object.assign(new PersonMeeting, {eventAttendance, adoptionCounselor});

                return newPersonMeeting.save().then(() => {
                    this.eventSocket.updateAdoptersAtEvent(eventId);
                    return newPersonMeeting;
                });
            })
        );
    }

    @Get(":id/meetings")
    @UseGuards(OrganizationEventGuard)
    getMeetingsAtEvent(@Param("id") eventId: number, @Body("currentUser") adoptionCounselor: User): Observable<PersonMeeting[]> {
        return Observable.fromPromise(
            PersonMeeting.createQueryBuilder("person_meeting")
                .innerJoinAndSelect("person_meeting.adopter", "adopter")
                .innerJoinAndSelect("adopter.eventAttendances", "event_attendance")
                .leftJoinAndSelect("adopter.animalMeetings", "animal_meetings", "animal_meetings.concluded_at IS NULL")
                .leftJoinAndSelect("animal_meetings.animal", "animal")
                .where("person_meeting.event_id = :eventId", {eventId})
                .andWhere("event_attendance.event_id = :eventId", {eventId})
                .andWhere("animal_meetings.event_id = :eventId", {eventId})
                .andWhere("person_meeting.adoption_counselor_id = :adoptionCounselorId", {adoptionCounselorId: adoptionCounselor.id})
                .andWhere("event_attendance.concluded_at IS NULL")
                .andWhere("person_meeting.concluded_at IS NULL")
                .andWhere("animal_meetings.concluded_at IS NULL")
                .orderBy("person_meeting.created_at", "DESC")
                .getMany()
        );
    }
}
