# Reading Notes for Set With Friends

### Todos
https://firebase.google.com/docs/database/web/start?authuser=0


### How do they pass states and control down the hierarchy?

- Game state is stored in and updated via firebase
    - let's say handleChange is a game state mutator that corresponds to some UI event
    - handleChange would simply call firebase.database().ref(name).set(value)  
    - where 'name' is path to the state we're interested in updating
- Local states are stored in contexts
    - user context, settings context
    - related to the firebase/game object?

Example
 
Let's take `GameSettings.js`, line 54, for example. This creates a switch button that toggles hints in the game. To see if hint is enabled (i.e. perform a read), we'd call `hasHint(game)` on the game object, which in turn reads `game.enableHint`. To toggle the status of the hint (i.e. perform a write), we'd call `toggleHint`, which in turn sets the firebase object `games/${gameId}/enableHint` to the negation of `game.enableHint`. In pseudo-code, this essentially does the following: `game.enableHint := !game.enableHint`. 

Therefore, after we set the firebase object, firebase will sync the data with the online server, and also update the value of our local game object. Finally, it will inform React of the updated game object , and our page will be re-rendered accordingly. 

The remaining question is, how exactly do we set up firebase to do that? 

Well, here's how the game object is created: in RoomPage.js, line 62, 

```javascript
    const [game, loadingGame] = useFirebaseRef(`games/${gameId}`);
```

So useFirebaseRef is a nice hook that does all the dirty work for us. 
Indeed, `updates[path]` is an event listener that listens to `value` events on the firebase ref object that corresponds to the path. Whenever firebase receivse a new value for `path` it emits the event, and we'll respond in the event listener by taking the new value and update the game state with it. 

**Important takeaway**: In this model, we NEVER update local states directly. All updates go to the server first. The server will commit and respond with 'value' events, which we then use to perform local updates. So all updates are slow, latency is at least the round trip time.


How is it initialized?
 
In index.ts, createGame creates a new game in DB!!!

Does Firebase need to know of the schema of the game object in advance?

Yes. See description below (https://firebase.google.com/docs/database/web/start?authuser=0):
The Realtime Database provides a declarative rules language that allows you to define how your data should be structured, how it should be indexed, and when your data can be read from and written to.


Nice way to send logs as we update :
```
    ...
    .update(kvs)
    .then(() => firebase.analytics().logEvent("join_game", { gameId }))
```

Wow useStorage seems really inefficient.. every object listens to a single global update??? guess it's okay in the tens or hundreds...

### project structure 
- hooks/ 
- pages/   (full pages that can be routed to)
- components/ (anything smaller than a page)
- utils/
- assets/  (midori pics belong here)
### Other information

- UI framework : Matieral UI
- Router framework : react-router-dom
- what makes up the game state?

- what does firebase store?
- coding conventions (e.g. hooks, effects)





### Notes on Hooks
Effects by default run after first render and every update.

After an effect is run, assuming it changes any states, then the components in charge of the states will re-render. So eventually our hook runs again, and everything is re-evaluated (including the useEffect clause), and our effect is set up again waiting to be executed right after the re-render finishes and cleanup on that effect is run. This goes on and on, until either our effect stops changing any state, or only changes states that are NOT part of the dependency array of any effect.

We must be cautious not to trigger one effect from another in a way that leads to infinite loops. Dependency arrays will help a lot.

If you leave the dependency empty, your effect will be executed after every render cycle.

https://blog.logrocket.com/guide-to-react-useeffect-hook/

Props and state changes both trigger an update, they don't really make a difference.

Use ESLint plugin for hooks!