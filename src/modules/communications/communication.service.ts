import { Component } from "@nestjs/common";

import * as twilio from "twilio";

@Component()
export class CommunicationService {
    constructor() {

    }

    sendMessage(to: string, message: string): Promise<void> {

    }
}
