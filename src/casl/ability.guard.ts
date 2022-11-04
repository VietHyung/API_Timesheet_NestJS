import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AbilityFactory } from './ability.factory';
import { CHECK_ABILITY, RequiredRule } from './ability.decorator';
import { ForbiddenError } from "@casl/ability";


@Injectable()
export class AbilitiesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: AbilityFactory,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const rules =
            this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) || [];

        const { user } = await context.switchToHttp().getRequest();
        console.log(user)
        const ability = this.caslAbilityFactory.userAbility(user)
        try {
            rules.forEach((rule) =>
                ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject),
            );
            return true;
        } catch (error) {
            if (error instanceof ForbiddenError) {
                throw new ForbiddenException(error.message);
            }
        }
    }

}