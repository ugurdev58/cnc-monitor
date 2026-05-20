import { Controller, Get, Query } from '@nestjs/common';
import { CncService } from './cnc.service';

@Controller('cnc')
export class CncController {
  constructor(private readonly cncService: CncService) {}

  @Get('veriler')
  verilerGetir(@Query('limit') limit?: string) {
    return this.cncService.sonVerileriGetir(limit ? +limit : 50);
  }
}
