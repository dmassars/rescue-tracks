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
            .innerJoinAndSelect("person_meeting.adopter", "adopter")
            .innerJoinAndSelect("adopter.eventAttendances", "event_attendance")
            .where("person_meeting.event_id = :eventId", {eventId})
            .andWhere("event_attendance.event_id = :eventId", {eventId})
            .andWhere("event_attendance.concluded_at IS NULL")
            .andWhere("person_meeting.concluded_at IS NULL")
            .getMany();
    }

    getAdoptersWaitingAtEvent(eventId: number): Promise<EventAttendance[]> {
        return EventAttendance.createQueryBuilder("event_attendance")
            .innerJoinAndSelect("event_attendance.adopter", "adopter")
            .leftJoin("adopter.personMeetings", "person_meetings")
            .where("event_attendance.event_id = :eventId", {eventId})
            .andWhere("(person_meetings.event_id IS NULL OR person_meetings.event_id = :eventId)", {eventId})
            .andWhere("event_attendance.concluded_at IS NULL")
            .andWhere("(person_meetings.id IS NULL OR person_meetings.concluded_at IS NOT NULL)")
            .getMany();
    }

    getAnimalsAtEvent(eventId: number): Promise<Animal[]> {
        return Animal.createQueryBuilder("animals")
            .innerJoin("animals.events", "events")
            .leftJoinAndSelect("animals.animalMeetings", "animal_meetings", "animal_meetings.active = true")
            .leftJoinAndSelect("animal_meetings.adoptionCounselor", "otherAdoptionCounselors")
            .leftJoinAndSelect("animal_meetings.adopter", "adopters")
            .orderBy("animals.name", "ASC")
            .where("events.id = :eventId", {eventId})
            .getMany();
    }
}
