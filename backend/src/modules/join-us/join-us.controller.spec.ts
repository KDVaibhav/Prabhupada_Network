import { Test, TestingModule } from '@nestjs/testing';
import { JoinUsController } from './join-us.controller';
import { JoinUsService } from './join-us.service';

describe('JoinUsController', () => {
  let controller: JoinUsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JoinUsController],
      providers: [JoinUsService],
    }).compile();

    controller = module.get<JoinUsController>(JoinUsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
