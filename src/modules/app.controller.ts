import { Get, Controller } from '@nestjs/common';

@Controller()
export class AppController {
    @Get("status")
    getStatus(): {status: string} {
        return {status: "up"};
    }
}
