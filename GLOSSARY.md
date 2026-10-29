# Icon playback

## Language

**Displayed pose**:
The transform currently rendered for an icon target, including interpolation between animation samples.

**Retained property pose**:
The independent rotation, translation, or scale values preserved when icon playback stops or completes. A later replay or return uses these values as its starting values.

**Return**:
Playback toward the icon's resting pose. A completed return restores the initial drawing.

**Hold completion**:
An entry that keeps its completed pose until replay, return, or reset. Finishing an entry does not make a later stop idle.
