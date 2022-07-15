import { Test, TestingModule } from '@nestjs/testing';
import { UasService } from './uas.service';

describe('UasService', () => {
  let service: UasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UasService],
    }).compile();

    service = module.get<UasService>(UasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
