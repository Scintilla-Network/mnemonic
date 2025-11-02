#!/bin/bash

# Dice to BIP39 Entropy Generator
# Generates entropy from physical dice rolls (or cards) for BIP39 mnemonic generation
echo "Dice to BIP39 Entropy Generator"
echo "=================================="
echo
echo "This script is designed to help you generate entropy for your mnemonic using physical randomness (e.g: dice rolls, cards, etc.)."
echo "Perform this process in a secure and private environment"
echo "Best is: no internet, no bluetooth chip. In faraday cage."
echo "- Screen can be recorded wirelessly (e.g: Horizon)"
echo ""

# Ask for die type
echo "What type of die are you using? (e.g., 6 for d6, 20 for d20 - Max 256)"
read -p "Number of faces: " DIE_FACES

# Dice with >256 faces don't provide additional entropy per roll
# Dice with <2 faces don't provide any entropy
if ! [[ "$DIE_FACES" =~ ^[0-9]+$ ]] || [ "$DIE_FACES" -lt 2 ] || [ "$DIE_FACES" -gt 256 ]; then
    echo "Error: Please enter a valid number of faces (2-256)"
    echo "Technical limit: Each roll is processed modulo 256 for entropy byte generation"
    exit 1
fi

# Ask for desired entropy strength
echo
echo "Choose entropy strength (bits):"
echo "  128 bits (12 words)"
echo "  160 bits (15 words)"
echo "  192 bits (18 words)"
echo "  224 bits (21 words)"
echo "  256 bits (24 words) <- Choose me please"
read -p "Enter entropy bits [128/160/192/224/256]: " ENTROPY_BITS

# Validate entropy bits
if ! [[ "$ENTROPY_BITS" =~ ^(128|160|192|224|256)$ ]]; then
    echo "Error: Please choose 128, 160, 192, 224, or 256 bits"
    exit 1
fi

# Calculate entropy bytes
ENTROPY_BYTES=$((ENTROPY_BITS / 8))

# Calculate required rolls based on entropy contribution per roll
# Each die face contributes log2(faces) bits of entropy
# We need enough rolls to reach the target entropy bits
calculate_required_rolls() {
    local faces=$1
    local target_bits=$2

    # Use bc for floating point calculation
    # log2(faces) = ln(faces)/ln(2)
    local bits_per_roll
    if command -v bc >/dev/null 2>&1; then
        bits_per_roll=$(echo "scale=2; l($faces)/l(2)" | bc -l)
    else
        # Fallback approximation without bc
        case $faces in
            2) bits_per_roll="1" ;;
            4) bits_per_roll="2" ;;
            6) bits_per_roll="2.58" ;;
            8) bits_per_roll="3" ;;
            10) bits_per_roll="3.32" ;;
            12) bits_per_roll="3.58" ;;
            16) bits_per_roll="4" ;;
            20) bits_per_roll="4.32" ;;
            32) bits_per_roll="5" ;;
            64) bits_per_roll="6" ;;
            100) bits_per_roll="6.64" ;;
            128) bits_per_roll="7" ;;
            256) bits_per_roll="8" ;;
            *) bits_per_roll="4" ;; # Default approximation
        esac
    fi

    # Calculate rolls needed: target_bits / bits_per_roll, rounded up
    local rolls_float
    rolls_float=$(echo "scale=2; $target_bits / $bits_per_roll" | bc -l 2>/dev/null || echo "$target_bits / $bits_per_roll" | awk '{printf "%.2f", $1/$3}')

    # Round up to nearest integer
    REQUIRED_ROLLS=$(echo "$rolls_float" | awk '{print int($1 + 0.999)}')
}

calculate_required_rolls "$DIE_FACES" "$ENTROPY_BITS"

echo
echo "Each d$DIE_FACES roll contributes to entropy"
echo "Need $REQUIRED_ROLLS rolls for $ENTROPY_BITS bits ($ENTROPY_BYTES bytes) of entropy"
echo

# Initialize variables
ROLLS=()

echo "Enter your dice rolls one by one (press Enter after each roll):"
echo "Valid rolls: 1-$DIE_FACES"
echo

while [ ${#ROLLS[@]} -lt $REQUIRED_ROLLS ]; do
    read -p "Roll $(( ${#ROLLS[@]} + 1 )) of $REQUIRED_ROLLS: " ROLL

    # Validate roll
    if ! [[ "$ROLL" =~ ^[0-9]+$ ]] || [ "$ROLL" -lt 1 ] || [ "$ROLL" -gt "$DIE_FACES" ]; then
        echo "Error: Please enter a number between 1 and $DIE_FACES"
        continue
    fi

    ROLLS+=("$ROLL")
    echo "✓ Roll recorded: $ROLL"
done

echo
echo "All rolls collected!"
echo

# Convert rolls to entropy bytes
echo "Converting dice rolls to entropy..."

# Concatenate all rolls into a large number string
ROLL_STRING=""
for ROLL in "${ROLLS[@]}"; do
    ROLL_STRING="${ROLL_STRING}${ROLL}"
done

# Extract entropy bytes from the roll string
ENTROPY_HEX=""
POSITION=0

for ((i=0; i<ENTROPY_BYTES; i++)); do
    # Take 2 digits from the roll string (or fewer if at end)
    DIGITS_TO_TAKE=2
    if [ $((POSITION + DIGITS_TO_TAKE)) -gt ${#ROLL_STRING} ]; then
        DIGITS_TO_TAKE=$(( ${#ROLL_STRING} - POSITION ))
        if [ $DIGITS_TO_TAKE -le 0 ]; then
            # If we run out of digits, start over from beginning
            POSITION=0
            DIGITS_TO_TAKE=2
            if [ $DIGITS_TO_TAKE -gt ${#ROLL_STRING} ]; then
                DIGITS_TO_TAKE=${#ROLL_STRING}
            fi
        fi
    fi

    BYTE_DIGITS=${ROLL_STRING:POSITION:DIGITS_TO_TAKE}
    POSITION=$((POSITION + DIGITS_TO_TAKE))

    # Convert to byte value (0-255)
    if [ ${#BYTE_DIGITS} -eq 1 ]; then
        BYTE_VALUE=$BYTE_DIGITS
    else
        BYTE_VALUE=$((10#${BYTE_DIGITS} % 256))
    fi

    BYTE_HEX=$(printf "%02x" $BYTE_VALUE)
    ENTROPY_HEX="${ENTROPY_HEX}${BYTE_HEX}"
done

echo
echo "Generated $ENTROPY_BITS-bit entropy:"
echo "$ENTROPY_HEX"
echo
echo "To use this:"
echo "  const entropy = new Uint8Array('$ENTROPY_HEX'.match(/.{2}/g).map(h => parseInt(h, 16)));"
echo "  const mnemonic = Mnemonic.generateMnemonic($ENTROPY_BITS, 'EN', () => entropy);"
echo "  console.log('Mnemonic:', mnemonic.phrase);"

echo
echo "Or for offline generation with the standalone bundle:"
echo "  # Use readable version (with examples):"
echo "  node -e \""
echo "    import('./public/mnemonic.standalone.js').then(({ Mnemonic }) => {"
echo "      const entropy = new Uint8Array('$ENTROPY_HEX'.match(/.{2}/g).map(h => parseInt(h, 16)));"
echo "      const mnemonicPhrase = Mnemonic.generateMnemonic($ENTROPY_BITS, 'EN', () => entropy);"
echo "      console.log('Mnemonic:', mnemonicPhrase);"
echo "    });"
echo "  \""
echo ""
echo "  # Or use minified version (smaller):"
echo "  # node -e \""
echo "  #   import('./public/mnemonic.standalone.min.js').then(({ Mnemonic }) => {"
echo "  #     const entropy = new Uint8Array('$ENTROPY_HEX'.match(/.{2}/g).map(h => parseInt(h, 16)));"
echo "  #     const mnemonicPhrase = Mnemonic.generateMnemonic($ENTROPY_BITS, 'EN', () => entropy);"
echo "  #     console.log('Mnemonic:', mnemonicPhrase);"
echo "  #   });"
echo "  # \""

echo
echo "Or for browser offline generation:"
echo "  Open public/bip39-standalone.html in a browser (no internet required)"
echo "  Paste the entropy hex above into the 'Entropy' field"