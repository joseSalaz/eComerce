import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { FormsModule } from '@angular/forms';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


@NgModule({ bootstrap: [AppComponent], imports: [AppModule,
        ServerModule,
        FormsModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppServerModule {}
