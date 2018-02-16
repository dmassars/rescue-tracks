import { Component } from "@nestjs/common";

import * as _ from "lodash";

import { Adopter } from "../entities/adopter.entity";
import { Animal } from "../entities/animal.entity";
import { PersonMeeting } from "../entities/person-meeting.entity";

@Component()
export class EventService {

    getAdoptersWaitingAtEvent(eventId: number): Promise<Adopter[]> {
        return PersonMeeting.createQueryBuilder("person_meeting")
            .innerJoinAndSelect("person_meeting.adopter", "adopter")
            .where("person_meeting.adoption_counselor_id IS NULL")
            .andWhere("person_meeting.event_id = :eventId", {eventId})
            .orderBy("person_meeting.created_at", "ASC")
            .getMany()
            .then(personMeetings => Promise.all<Adopter>(
                _.map(personMeetings, (personMeeting: PersonMeeting) =>
                    personMeeting.adopter.then((adopter: Adopter) =>
                        _.extend(adopter, {addedAt: personMeeting.createdAt})
                    )
                )
            ));
    }

    getAnimalsAtEvent(eventId: number): Promise<Animal[]> {
        return Animal.createQueryBuilder("animals")
            .innerJoin("animals.event", "events")
            .leftJoinAndSelect("animals.animalMeetings", "animal_meetings", "animal_meetings.active = true")
            .leftJoinAndSelect("animal_meetings.personMeeting", "person_meetings")
            .leftJoinAndSelect("person_meetings.adoptionCounselor", "otherAdoptionCounselors")
            .leftJoinAndSelect("person_meetings.adopter", "otherAdopters")
            .orderBy("animals.name", "ASC")
            .where("events.id = :eventId", {eventId})
            .getMany();
    }
}
