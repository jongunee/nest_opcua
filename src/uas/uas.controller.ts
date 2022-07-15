import { Controller, Get } from '@nestjs/common';
import { UasService } from './uas.service';

@Controller('uas')
export class UasController {
  constructor(private readonly uaService: UasService) {}
  @Get('create')
  getCreate() {
    return this.uaService.uaCreate();
  }

  @Get()
  getNodes() {
    return this.uaService.uaGetNodes();
  }
}
