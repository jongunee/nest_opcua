import { Test, TestingModule } from '@nestjs/testing';
import { UasController } from './uas.controller';

describe('UasController', () => {
  let controller: UasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UasController],
    }).compile();

    controller = module.get<UasController>(UasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
