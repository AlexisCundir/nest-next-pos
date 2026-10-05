import { Test, TestingModule } from '@nestjs/testing';
import { CouponsController } from './coupons.controller.js';
import { CouponsService } from './coupons.service.js';

describe('CouponsController', () => {
  let controller: CouponsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouponsController],
      providers: [CouponsService],
    }).compile();

    controller = module.get<CouponsController>(CouponsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
