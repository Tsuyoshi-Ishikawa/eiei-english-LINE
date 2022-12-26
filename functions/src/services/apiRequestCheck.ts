import {
  EventMessage,
  AudioEventMessage,
  WebhookEvent,
  MessageEvent,
} from '@line/bot-sdk';

export function isMessageEvent(event: WebhookEvent): event is MessageEvent {
  if (event.type !== 'message') {
    return false;
  }
  return true;
}

export function isAudioEventMessage(
  message: EventMessage,
): message is AudioEventMessage {
  if (message.type !== 'audio') {
    return false;
  }
  return true;
}
