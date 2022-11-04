import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDTO } from '../auth/dto/auth.input';
import { CaslModule } from '../casl/casl.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { TaskModule } from '../task/task.module';
import { UserRepository } from './user.repository';
import { AbilityFactory } from '../casl/ability.factory';

// describe('UserController', () => {
//   let controller: UserController;

//   const mockUserService = {
//     create: jest.fn(dto => {
//       return {
//         id: 2,
//         ...dto
//       }
//     })
//   }

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UserController],
//       providers: [UserService, AbilityFactory],
//     })
//       .overrideProvider(UserService)
//       .useValue(mockUserService)
//       .compile();

//     controller = module.get<UserController>(UserController);
//   });

//   it('should be wei wei wei wei', () => {
//     expect(controller).toBeDefined();
//   });

//   it('should be create a user', () => {
//     const data = new CreateUserDTO();
//     expect(controller.addUser(data)).not.toBeNull();
//   });

//   // it('should be create a user', () => {
//   //   const data = new CreateUserDTO();
//   //   data.name = 'hau';
//   //   data.password = '1234';
//   //   data.email = 'hau@gmail.com';
//   //   data.avatar = 'avatar1';
//   //   data.level = 2;

//   //   expect(controller.addUser(data)).not.toEqual(null)
//   //   expect(mockUserService.create).toHaveBeenCalledWith();
//   // });
// });

const createUserDto: CreateUserDTO = {
  name: "hieu",
  password: "123",
  email: "hieu123@gmail.com",
  avatar: "123",
  level: 3
};

// useFactory: () => ({
//   createUser: jest.fn(() => { })
// }),

describe('UserController', () => {
  let usersController: UserController;
  let spyService: UserService;

  beforeEach(async () => {
    const APIServiceProvider = {
      provide: UserService,
      useValue: {
        create: jest.fn().mockImplementation((user: CreateUserDTO) => Promise.resolve({ id: '14', ...user }),
        ),
      }
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        AbilityFactory,
        UserService,
        APIServiceProvider
      ],
    }).compile();

    usersController = app.get<UserController>(UserController);
    spyService = app.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should create a user', async () => {
    await usersController.addUser(createUserDto);
    expect(spyService.createOneObj).toHaveBeenCalled();
  });

  describe('findAll()', () => {
    it('should find all users ', async () => {
      await usersController.getAllUser();
      expect(spyService.getAllObj()).toHaveBeenCalled();
    });
  });
});