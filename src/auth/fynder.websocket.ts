import { Websocket, Message } from '@/settings/decorators';
import { LoggerService } from '@/settings/logger.service';
import type { WS } from '@/settings/types/common';

@Websocket('/ws/fynder')
export class FynderWebsocket {
	private readonly logger = LoggerService(FynderWebsocket.name);

	@Message()
	async messageHandler(ws: WS, message: any) {
		const userID = ws.data.store.user;
	}
}
