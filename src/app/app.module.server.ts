import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { FormsModule } from '@angular/forms';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  imports: [
    AppModule,
    ServerModule,
    FormsModule,
    HttpClientModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
