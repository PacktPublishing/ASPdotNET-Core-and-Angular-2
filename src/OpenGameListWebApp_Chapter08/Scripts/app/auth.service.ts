import {Injectable, EventEmitter} from "@angular/core";
import {Http, Headers, Response, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {AuthHttp} from "./auth.http";

@Injectable()
export class AuthService {
    authKey = "auth";

    constructor(private http: AuthHttp) {
    }

    login(username: string, password: string): any {
        var url = "api/connect/token";  // JwtProvider's LoginPath

        var data = {
            username: username,
            password: password,
            client_id: "OpenGameList",
            // required when signing up with username/password
            grant_type: "password",
            // space-separated list of scopes for which the token is issued
            scope: "offline_access profile email"
        };

        return this.http.post(
            url,
            this.toUrlEncodedString(data),
            new RequestOptions({
                headers: new Headers({
                    "Content-Type": "application/x-www-form-urlencoded"
                })
            }))
            .map(response => {
                var auth = response.json();
                console.log("The following auth JSON object has been received:");
                console.log(auth);
                this.setAuth(auth);
                return auth;
            });
    }

    logout(): any {
        return this.http.post(
            "api/Accounts/Logout",
            null)
            .map(response => {
                this.setAuth(null);
                return true;
            })
            .catch(err => {
                return Observable.throw(err);
            });
    }

    // Converts a Json object to urlencoded format
    toUrlEncodedString(data: any) {
        var body = "";
        for (var key in data) {
            if (body.length) {
                body += "&";
            }
            body += key + "=";
            body += encodeURIComponent(data[key]);
        }
        return body;
    }

    // Persist auth into localStorage or removes it if a NULL argument is given
    setAuth(auth: any): boolean {
        if (auth) {
            localStorage.setItem(this.authKey, JSON.stringify(auth));
        }
        else {
            localStorage.removeItem(this.authKey);
        }
        return true;
    }

    // Retrieves the auth JSON object (or NULL if none)
    getAuth(): any {
        var i = localStorage.getItem(this.authKey);
        if (i) {
            return JSON.parse(i);
        }
        else {
            return null;
        }
    }

    // Returns TRUE if the user is logged in, FALSE otherwise.
    isLoggedIn(): boolean {
        return localStorage.getItem(this.authKey) != null;
    }
}
