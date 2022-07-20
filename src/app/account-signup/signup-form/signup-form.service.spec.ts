import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SignupFormService } from './signup-form.service';
import { environment } from 'src/environments/environment';
import { User } from './user.interface';

describe('FormService', () => {
  let service: SignupFormService;
  let controller: HttpTestingController;

  const mockUserInput = { firstName: 'Hello', lastName: 'World', email: 'hello@world.com', password: 'StrongPAss' };
  const mockUserResponse = { _id: 123, firstName: 'Hello', lastName: 'World', email: 'hello@world.com', password: 'StrongPAss' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SignupFormService],
    });
    service = TestBed.inject(SignupFormService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('Adds user', () => {
    let actualResponse: User | undefined;
    service.addUser$(mockUserInput).subscribe((res) => (actualResponse = res));

    const request = controller.expectOne(environment.apiUrl);
    request.flush(mockUserResponse);

    expect(request.request.method).toBe('POST');
    expect(actualResponse).toEqual(mockUserResponse);
    controller.verify();
  });
});
