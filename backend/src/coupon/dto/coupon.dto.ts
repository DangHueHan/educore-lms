export class CouponDto {

  code: string;

  discountPercent: number;

  quantity: number;

  isActive?: boolean;

  startDate: Date;

  endDate: Date;

}
export class AssignCoursesDto {

  courseIds: string[];

}