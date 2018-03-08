import * as socketIO from "socket.io";

import { BehaviorSubject } from "rxjs";

export class AbstractSocket {
    protected buildSocketUpdater<T, U>(server: SocketIO.Server, service: T): <V>(identifier: U, socketEvent: string, serviceFunctionName: string) => void {
        let updaters: Map<string, Map<U, BehaviorSubject<any>>> = new Map<string, Map<U, BehaviorSubject<any>>>();

        return <V>(identifier: U, socketEvent: string, serviceFunctionName: string): void => {
            if (updaters.has(socketEvent)) {
                updaters.set(socketEvent, new Map<U, BehaviorSubject<V>>());
            }

            let updater: Map<U, BehaviorSubject<V>> = new Map<U, BehaviorSubject<V>>();

            if (!updater.has(identifier)) {
                let eventResults = new BehaviorSubject<V>(undefined);

                updater.set(identifier, eventResults);

                eventResults.subscribe((results: V) => server.emit(socketEvent, results));
            }

            service[serviceFunctionName] && service[serviceFunctionName](identifier).then((results: V) => updater.get(identifier).next(results));
        };
    }
}
