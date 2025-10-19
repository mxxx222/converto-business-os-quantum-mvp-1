# Sound Effects (SFX)

This directory contains sound effect files for the Converto Business OS UI.

## Required Files

Place the following audio files here:

- `click.mp3` - Button tap/click sound (50-100ms, ≤10KB)
- `success.mp3` - Success/achievement sound (100-250ms, ≤15KB)
- `levelup.mp3` - Level up/streak milestone sound (200-500ms, ≤20KB)

## Recommended Sources

Free, royalty-free sound effects:

- **Mixkit**: https://mixkit.co/free-sound-effects/
- **Zapsplat**: https://www.zapsplat.com/
- **Freesound**: https://freesound.org/
- **Pixabay**: https://pixabay.com/sound-effects/

## Guidelines

- **Format**: MP3 or OGG (MP3 preferred for compatibility)
- **Duration**: Keep sounds short and snappy (50-500ms)
- **File Size**: ≤20KB per file
- **Volume**: Normalize to -12dB to -6dB
- **Quality**: 128kbps is sufficient for UI sounds

## Example Search Terms

- "button click"
- "success chime"
- "level up"
- "notification beep"
- "UI sound"

## Testing

After adding files, test with:

```bash
# Start frontend
cd frontend
npm run dev

# Open browser console
# Toggle sound in settings
# Click buttons to hear effects
```

## Accessibility

Sound effects are:
- ✅ Optional (can be disabled)
- ✅ Volume adjustable
- ✅ Saved to localStorage
- ✅ Accompanied by visual feedback
- ✅ Never required for functionality
