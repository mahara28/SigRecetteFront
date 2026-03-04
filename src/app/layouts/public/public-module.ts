import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Public } from './public';
import { AuthentificationRoutingModule } from "./pages/authentification/authentification-routing.module";
import { AppSharedModule } from '../../app-shared/app-shared-module';

@NgModule({
    declarations: [
        Public
    ],


    imports: [
    CommonModule,
    AppSharedModule,
    AuthentificationRoutingModule,
]
})
export class PublicModule {
}
