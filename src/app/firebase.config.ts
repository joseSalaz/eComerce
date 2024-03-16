import { EnvironmentProviders, importProvidersFrom } from "@angular/core";
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

const firebaseProvaiders : EnvironmentProviders = importProvidersFrom([
    provideFirebaseApp(() => initializeApp({"projectId":"ecomercesa-3c1ff","appId":"1:600924951861:web:cdafa4c00800d3f6d0287c","storageBucket":"ecomercesa-3c1ff.appspot.com","apiKey":"AIzaSyDalTAm9ttdXOJll_8B89SHHyNCP8Jm_rM","authDomain":"ecomercesa-3c1ff.firebaseapp.com","messagingSenderId":"600924951861"})),
    provideAuth(() => getAuth())
])

export {firebaseProvaiders};