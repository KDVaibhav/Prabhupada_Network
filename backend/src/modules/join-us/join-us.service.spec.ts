import { Test, TestingModule } from '@nestjs/testing';
import { JoinUsService } from './join-us.service';

describe('JoinUsService', () => {
  let service: JoinUsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JoinUsService],
    }).compile();

    service = module.get<JoinUsService>(JoinUsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
