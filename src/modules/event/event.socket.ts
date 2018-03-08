import {
    OnGatewayInit,
    WebSocketGateway,
} from "@nestjs/websockets";

import * as socketIO from "socket.io";

import { AbstractSocket } from "../abstract-socket";

import { EventService } from "./event.service";
import { Adopter } from "../entities/adopter.entity";
import { Animal } from "../entities/animal.entity";

@WebSocketGateway({namespace: "event"})
export class EventSocket extends AbstractSocket implements OnGatewayInit {
    private autoUpdater: <T>(identifier: number, socketEvent: string, serviceFunctionName: string) => void;

    constructor(private eventService: EventService) {
        super();
    }

    afterInit(server: SocketIO.Server) {
        this.autoUpdater = this.buildSocketUpdater<EventService, number>(server, this.eventService);
    }

    updateAdoptersAtEvent(eventId: number): void {
        this.autoUpdater<Adopter[]>(eventId, "adopters", "getAdoptersWaitingAtEvent");
    }

    updateAnimalsAtEvent(eventId: number): void {
        this.autoUpdater<Animal[]>(eventId, "animals", "getAnimalsAtEvent");
    }
}
