import EventEmitter from "events";
import WebSocketLib from "ws";

export const MyWebSocket = WebSocketLib & EventEmitter;
