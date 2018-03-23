import { Component } from "@nestjs/common";

import * as _ from "lodash";

import { Adopter } from "../entities/adopter.entity";
import { Animal } from "../entities/animal.entity";
import { PersonMeeting } from "../entities/person-meeting.entity";
import { EventAttendance } from "../entities/event-attendance.entity";


@Component()
export class EventService {

    getActiveMeetingsAtEvent(eventId: number): Promise<PersonMeeting[]>{
        return PersonMeeting.createQueryBuilder("person_meeting")
            .innerJoin("person_meeting.eventAttendance", "event_attender")
            .innerJoinAndSelect("event_attender.adopter", "adopter")
            .where("event_attender.event_id = :eventId", {eventId})
            .andWhere("event_attender.active")
            .andWhere("person_meeting.concluded_at IS NULL")
            .getMany();
    }

    getAdoptersWaitingAtEvent(eventId: number): Promise<EventAttendance[]> {
        return EventAttendance.createQueryBuilder("event_attender")
            .innerJoinAndSelect("event_attender.adopter", "adopter")
            .leftJoin("event_attender.personMeetings", "person_meetings")
            .where("event_attender.event_id = :eventId", {eventId})
            .andWhere("event_attender.active")
            .andWhere("(person_meetings.id IS NULL OR person_meetings.concluded_at IS NOT NULL)")
            .getMany();
    }

    getAnimalsAtEvent(eventId: number): Promise<Animal[]> {
        return Animal.createQueryBuilder("animals")
            .innerJoin("animals.events", "events")
            .leftJoinAndSelect("animals.animalMeetings", "animal_meetings", "animal_meetings.active = true")
            .leftJoinAndSelect("animal_meetings.personMeeting", "person_meetings")
            .leftJoinAndSelect("person_meetings.adoptionCounselor", "otherAdoptionCounselors")
            .leftJoin("person_meetings.eventAttendance", "event_attenders")
            .leftJoinAndSelect("event_attenders.adopter", "adopters")
            .orderBy("animals.name", "ASC")
            .where("events.id = :eventId", {eventId})
            .getMany();
    }
}
