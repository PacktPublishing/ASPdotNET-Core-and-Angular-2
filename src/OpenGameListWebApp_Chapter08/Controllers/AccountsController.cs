using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OpenGameListWebApp.Data;
using OpenGameListWebApp.Data.Users;
using OpenGameListWebApp.ViewModels;

namespace OpenGameListWebApp.Controllers
{
    public class AccountsController : BaseController
    {
        #region Constructor
        public AccountsController(
            ApplicationDbContext context,
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager) : base(
            context,
            signInManager,
            userManager)
        { }
        #endregion Constructor

        #region External Authentication Providers
        // GET: /api/Accounts/ExternalLogin
        [HttpGet("ExternalLogin/{provider}")]
        public IActionResult ExternalLogin(string provider, string returnUrl = null)
        {
            switch (provider.ToLower())
            {
                case "facebook":
                case "google":
                case "twitter":
                    // Request a redirect to the external login provider.
                    var redirectUrl = Url.Action("ExternalLoginCallback", "Accounts", new { ReturnUrl = returnUrl });
                    var properties = SignInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
                    return Challenge(properties, provider);
                default:
                    return BadRequest(new { Error = String.Format("Provider '{0}' is not supported.", provider) });
            }
        }

        [HttpGet("ExternalLoginCallBack")]
        public async Task<IActionResult> ExternalLoginCallback(string returnUrl = null, string remoteError = null)
        {
            try
            {
                // Check if the External Provider returned an error and act accordingly
                if (remoteError != null)
                {
                    throw new Exception(remoteError);
                }

                // Extract the login info obtained from the External Provider
                ExternalLoginInfo info = await SignInManager.GetExternalLoginInfoAsync();
                if (info == null)
                {
                    // if there's none, emit an error
                    throw new Exception("ERROR: No login info available.");
                }

                // Check if this user already registered himself with this external provider before
                var user = await UserManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
                if (user == null)
                {
                    // If we reach this point, it means that this user never tried to logged in
                    // using this external provider. However, it could have used other providers 
                    // and /or have a local account. 
                    // We can find out if that's the case by looking for his e-mail address.

                    // Retrieve the 'emailaddress' claim
                    var emailKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
                    var email = info.Principal.FindFirst(emailKey).Value;

                    // Lookup if there's an username with this e-mail address in the Db
                    user = await UserManager.FindByEmailAsync(email);
                    if (user == null)
                    {
                        // No user has been found: register a new user using the info retrieved from the provider
                        DateTime now = DateTime.Now;

                        // Create a unique username using the 'nameidentifier' claim
                        var idKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
                        var username = String.Format("{0}{1}", info.LoginProvider, info.Principal.FindFirst(idKey).Value);

                        user = new ApplicationUser()
                        {
                            UserName = username,
                            Email = email,
                            CreatedDate = now,
                            LastModifiedDate = now
                        };

                        // Add the user to the Db with a random password
                        await UserManager.CreateAsync(user, "Pass4External");

                        // Assign the user to the 'Registered' role.
                        await UserManager.AddToRoleAsync(user, "Registered");

                        // Remove Lockout and E-Mail confirmation
                        user.EmailConfirmed = true;
                        user.LockoutEnabled = false;
                    }
                    // Register this external provider to the user
                    await UserManager.AddLoginAsync(user, info);

                    // Persist everything into the Db
                    await DbContext.SaveChangesAsync();
                }

                // create the auth JSON object
                var auth = new
                {
                    type = "External",
                    providerName = info.LoginProvider
                };

                // output a <SCRIPT> tag to call a JS function registered into the parent window global scope
                return Content(
                    "<script type=\"text/javascript\">" +
                    "window.opener.externalProviderLogin(" + JsonConvert.SerializeObject(auth) + ");" +
                    "window.close();" +
                    "</script>",
                    "text/html"
                    );
            }
            catch (Exception ex)
            {
                // return a HTTP Status 400 (Bad Request) to the client
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPost("Logout")]
        public IActionResult Logout()
        {
            if (HttpContext.User.Identity.IsAuthenticated)
            {
                SignInManager.SignOutAsync().Wait();
            }
            return Ok();
        }
        #endregion External Authentication Providers
    }
}
