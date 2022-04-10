#!/usr/bin/env bash

PS3="Enter a number: "

function voicePick() {
  case $1 in
    "All Dragons") voice="Bad News" ;;
    "All Knights") voice="Tom" ;;
    "All Princesses") voice="Ava" ;;
    "Princess 1") voice="Agnes" ;;
    "Susie") voice="Allison" ;;
    "Little Dragon") voice="Alex" ;;
    "Princess 3") voice="Susan" ;;
    "Jester") voice="Cellos" ;;
    "Fairy 2") voice="Aurlie" ;;
    "Princess 2 & 4") voice="Siri Female" ;;
    "Knight 1") voice="Tarek" ;;
    "Fairy 2&3") voice="Vicki" ;;
    "Princess 4") voice="Samantha" ;;
    "Princess 2") voice="Laila" ;;
    "Fairy 3") voice="Moria" ;;
    *)
      voice="Ava"
      ;;
# Fairy 3
# Jester
# Knight 1
# Knight 2
# Knight 3
# Knight 4
# Knight 5
# Princess 2
# Princess 3 & 4
# Princess 4
  esac
  echo "$voice"
}

select character in "Aseel" "Fouad" "Hala" "Hassan" "Malika G." "Mariam" "Mohamed" "Moussa" "Omar W." "Orhan" "Rokaia" "Roya" "Selim" "Sumeyra" "Yassin"
do
    echo "Selected character: $character"
    # echo "Selected number: $REPLY"
    for i in $(seq 100); do
      clear
      echo
      actor=$(octosql --output csv "select actor from script2.csv where id = $i" | uniq | tail +2)
      char=$(octosql --output csv "select character from script2.csv where id = $i" | uniq | tail +2)
      line=$(octosql --output csv "select line from script2.csv where id = $i" | uniq | tail +2)
      rate=$(octosql --output csv "select wpm from script2.csv where id = $i" | uniq | tail +2)
      echo "$char"
      voice="$(voicePick "$char")"
      echo "$voice"
      if [[ $actor == $character ]]; then
        echo "And You Say.."
        echo
        say -v "Ava" -r "120" "And You Say.."
        echo "        $line"
        echo
      elif [[ $actor == "scene" ]]; then
        echo
        say -v "$voice" -r "$rate" "$line"
        echo
      else
        echo
        echo "$char Now Speaking"
        echo
        echo "        $line"
        echo
        say -v "$voice" -r "$rate" "$line"
        # say "$char Says"
      fi
      sleep 2
      clear
    done
done
