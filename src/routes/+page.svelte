<script>
	import Chat from '$lib/components/Chat.svelte';
	import Carousel from '$lib/components/splide/Carousel.svelte';
	import BlogGrid from '$lib/components/BlogGrid.svelte';
	  
	async function requestNotificationPermission() {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      await showNotification("Hi there!", {
        actions: [
          {
            action: "hello",
            title: "say hello",
          },
        ],
        body: "How are you doing?",
        icon: "logo.svg",
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        requireInteraction: true,
        renotify: true,
        image: "og.png",
        tag: "notification-sample",
        lang: "en",
        dir: "ltr",
        badge: "logo.svg",
        sound: "mixkit-bubble-pop-up-alert-notification-2357.wav",
      });
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          const notification = new Notification("Hi there!");
          // …
        }
      });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
  }

  // example notification
  async function showNotification(message, options) {
    const registration = await navigator.serviceWorker.ready;
    // Show a notification that includes an action titled Archive.
    registration.showNotification(message, options);
  }
</script>

<Carousel />
<BlogGrid />
<button
class="transition cursor-pointer xl:mb-5 mr-5 xl:mr-0"
on:click={requestNotificationPermission}
>
<img src="/images/subscriptions.webp" alt="notify me" class="w-10 h-10" />
</button>
<Chat />
