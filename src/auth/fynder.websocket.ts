import { LoggerService } from '@/helper/logger.service';
import { Websocket, Message } from '@/settings/decorators';
import type { WS } from '@/types/common';

@Websocket('/ws/fynder')
export class FynderWebsocket {
	private readonly logger = LoggerService(FynderWebsocket.name);

	@Message()
	async messageHandler(ws: WS, message: any) {
		const userID = ws.data.store.user;
	}
}
