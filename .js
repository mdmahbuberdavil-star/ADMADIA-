/* ================================================================
   ACTIVATION GATE
   ----------------------------------------------------------------
   The app boots ONLY when:
     (1) settings/activation.active === true
     (2) settings/activation.key matches the key embedded below
     (3) the current host matches settings/activation.host (if set)

   Honest note: a determined attacker can edit the file to skip this
   check. What they CANNOT do is make the database accept their
   requests — the security rules above still gate every read/write.
   So a stolen file is a UI shell with no data. That is the real
   protection; this gate is the polite "please don't" on top.
   ================================================================ */
const ACTIVATION_KEY = 'Ss2xfbAjDoeNarOWOslUWuBNqAj2'; // ← change this to your own random string

async function checkActivation(){
  try {
    const snap = await get(ref(db, 'settings/activation'));
    if (!snap.exists()) return { ok:false, reason:'No activation record found.' };
    const a = snap.val() || {};
    if (a.active !== true)            return { ok:false, reason:'Activation is disabled in the admin portal.' };
    if (a.key    !== ACTIVATION_KEY)  return { ok:false, reason:'Activation key mismatch.' };
    if (a.host && !location.hostname.endsWith(a.host.replace(/^\./,'')))
                                      return { ok:false, reason:'This deployment is not licensed for ' + location.hostname + '.' };
    return { ok:true };
  } catch(e){
    return { ok:false, reason:'Activation check failed: ' + (e && e.message || 'unknown') };
  }
}

const _activation = await checkActivation();
if (!_activation.ok && !_trackCid) {
  document.body.innerHTML = `
    <div style="min-height:100vh;display:grid;place-items:center;font-family:'Poppins',sans-serif;
      background:#181c32;color:#fff;padding:24px;text-align:center;">
      <div style="max-width:520px;">
        <div class="cpabuild-logo md" style="justify-content:center;margin-bottom:22px;">
          <span>C</span><span>P</span><span>A</span><span>B</span><span>u</span><span>i</span><span>l</span><span>d</span>
        </div>
        <h1 style="font-size:22px;margin:0 0 10px;">This deployment is not activated</h1>
        <p style="color:#a1a1aa;font-size:14px;line-height:1.6;">
          ${_activation.reason}<br><br>
          If you are the network owner, open the admin portal and enable activation
          under <em>Master Settings → Activation</em>.
        </p>
      </div>
    </div>`;
  // Halt further script execution by throwing — the module top-level
  // await already resolved, so we must prevent the rest of the file
  // from running. The cleanest way is to not define anything else.
  throw new Error('ACTIVATION_FAILED');
}
