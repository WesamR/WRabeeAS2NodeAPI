//Code by Wesam Rabee, Using API I made to allow user to return greeting message after giving a few options
using System.Net.Http;
using System.Text.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ConsoleRunningCode
{
    class Program
    {
        static async Task Main(string[] args)
        {
            using (HttpClient client = new HttpClient())
            {
                var url = "http://localhost:3000/";
                var endpoint_AllTimesOfDay = "api/WRtimesOfDay";
                var endpoint_AllLanguages = "api/WRlanguages";
                var endpoint_Greet = "api/WRgreet";

                // all times of day
                HttpResponseMessage allTimesResponse = await client.GetAsync(url + endpoint_AllTimesOfDay);
                allTimesResponse.EnsureSuccessStatusCode();
                var allTimesOfDayList = JsonSerializer.Deserialize<List<string>>(await allTimesResponse.Content.ReadAsStringAsync());

                // all languages
                HttpResponseMessage allLanguagesResponse = await client.GetAsync(url + endpoint_AllLanguages);
                allLanguagesResponse.EnsureSuccessStatusCode();
                var allLanguagesList = JsonSerializer.Deserialize<List<string>>(await allLanguagesResponse.Content.ReadAsStringAsync());

                Console.WriteLine("All Times of Day:");
                foreach (var time in allTimesOfDayList)
                {
                    Console.WriteLine(time);
                }

                Console.WriteLine("\nAll Languages:");
                foreach (var language in allLanguagesList)
                {
                    Console.WriteLine(language);
                }

                Console.WriteLine("\nPlease select a time of day for the greeting:");
                string userTimeOfDay = Console.ReadLine();

                if (!allTimesOfDayList.Contains(userTimeOfDay))
                {
                    Console.WriteLine("Time of day entered is not in my list, please try again with one of the above");
                    return;
                }

                Console.WriteLine("Please select a language for the greeting:");
                string userLanguage = Console.ReadLine();

                if (!allLanguagesList.Contains(userLanguage))
                {
                    Console.WriteLine("Language entered is not in my list, please try again with one of the above");
                    return;
                }

                Console.WriteLine("Please select a tone for the greeting (Casual or Formal):");
                string userTone = Console.ReadLine();

                if (userTone != "Casual" && userTone != "Formal")
                {
                    Console.WriteLine("Tone entered is not in my list, please try again, either Casual or Formal");
                    return;
                }

                var request = new
                {
                    timeOfDay = userTimeOfDay,
                    language = userLanguage,
                    tone = userTone
                };

                var jsonRequest = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");

                HttpResponseMessage greetResponse = await client.PostAsync(url + endpoint_Greet, jsonRequest);
                greetResponse.EnsureSuccessStatusCode();
                var greetingResponse = await greetResponse.Content.ReadAsStringAsync();

                Console.WriteLine("\nYour Perfect Greeting: " + greetingResponse);
            }
        }
    }
}
