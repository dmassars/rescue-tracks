import {
    OnGatewayConnection,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";

import * as _ from "lodash";
import * as socketIO from "socket.io";

import { Observable, BehaviorSubject } from "rxjs";

import { EventService } from "./event.service";
import { Adopter } from "../entities/adopter.entity";
import { Animal } from "../entities/animal.entity";

@WebSocketGateway({namespace: "event"})
export class EventSocket implements OnGatewayConnection {

    @WebSocketServer()
    private server: SocketIO.Server;

    private adoptersAtEvent: Map<number, BehaviorSubject<Adopter[]>>;
    private animalsAtEvent: Map<number, BehaviorSubject<Animal[]>>;

    constructor(private eventService: EventService) {
        this.adoptersAtEvent = new Map<number, BehaviorSubject<Adopter[]>>();
        this.animalsAtEvent  = new Map<number, BehaviorSubject<Animal[]>>();
    }

    handleConnection(socket: SocketIO.Socket) {
        // let eventId = _.get(socket, "request._query.event_id");
        // let action  = _.get(socket, "request._query.action");

        // let actionMapping = {
        //     adopters: () => this.eventService.getAdoptersWaitingAtEvent(eventId),
        //     animals:  () => this.eventService.getAnimalsAtEvent(eventId)
        // };

        // if(!eventId || !action || !actionMapping[action]) {
        //     return;
        // }

        // setTimeout(() => {
        //     actionMapping[action]().then((result) => {
        //         debugger;
        //         socket.server.of("/event").to(socket.client.id).emit(action, result)
        //     });
        // })

    }

    updateAdoptersAtEvent(eventId: number): void {
        if(!this.adoptersAtEvent.has(eventId)) {
            let eventAdopters = new BehaviorSubject<Adopter[]>([]);
            this.adoptersAtEvent.set(eventId, eventAdopters);

            eventAdopters.subscribe((adopters: Adopter[]) => this.server.emit("adopters", adopters));
        }

        this.eventService.getAdoptersWaitingAtEvent(eventId).then((adopters: Adopter[]) => {
            this.adoptersAtEvent.get(eventId).next(adopters);
        });
    }

    updateAnimalsAtEvent(eventId: number): void {
        if(!this.animalsAtEvent.has(eventId)) {
            let eventAnimals = new BehaviorSubject<Animal[]>([]);
            this.animalsAtEvent.set(eventId, eventAnimals);

            eventAnimals.subscribe((animals: Animal[]) =>
                this.server.emit("animals", animals)
            );
        }

        this.eventService.getAnimalsAtEvent(eventId).then((animals: Animal[]) =>
            this.animalsAtEvent.get(eventId).next(animals)
        );
    }

}
