import { Component } from "@nestjs/common";

import * as _ from "lodash";

import { Adopter } from "../entities/adopter.entity";
import { Animal } from "../entities/animal.entity";
import { Message } from "../entities/message.entity";
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
            .leftJoinAndSelect("adopter.meetingSetups", "meetingSetup", "meetingSetup.event_id = event_attendance.event_id")
            .leftJoinAndSelect("meetingSetup.animal", "animal")
            .leftJoin("adopter.personMeetings", "person_meetings", "person_meetings.event_id = event_attendance.event_id")
            .where("event_attendance.event_id = :eventId", {eventId})
            .andWhere("event_attendance.concludedAt IS NULL")
            .andWhere("(person_meetings.id IS NULL)")  // OR person_meetings.concluded_at IS NOT NULL)")
            .getMany();
    }

    getAnimalsAtEvent(eventId: number): Promise<Animal[]> {
        return Animal.createQueryBuilder("animals")
            .innerJoin("animals.events", "events")
            .leftJoinAndSelect("animals.meetingSetups", "meeting_setups", "meeting_setups.event_id = events.id")
            .leftJoinAndSelect("animals.animalMeetings", "animal_meetings", "animal_meetings.active = true OR animal_meetings.adopted = true")
            .leftJoinAndSelect("animal_meetings.adoptionCounselor", "otherAdoptionCounselors")
            .leftJoinAndSelect("animal_meetings.adopter", "adopters")
            .orderBy("animals.name", "ASC")
            .where("events.id = :eventId", {eventId})
            .getMany();
    }

    getEventMessages(eventId: number): Promise<Message[]> {
        return Message.createQueryBuilder("messages")
            .innerJoinAndSelect("messages.sender", "sender")
            .orderBy("messages.createdAt", "ASC")
            .where("messages.event_id = :eventId", {eventId})
            .getMany();
    }
}
