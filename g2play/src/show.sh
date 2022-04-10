#!/usr/bin/env bash

PS3="Enter a number: "

function voicePick() {
  case $1 in
    "All Dragons") voice="Bad News" ;;
    "All Knights") voice="Tom" ;;
    "All Princesses") voice="Ava" ;;
    "Princess 1") voice="Samantha" ;;
    "Susie") voice="Allison" ;;
    "Little Dragon") voice="Alex" ;;
    "Princess 3") voice="Susan" ;;
    "Jester") voice="Cellos" ;;
    "Fairy 2") voice="Karen" ;;
    "Princess 2 & 4") voice="Serena" ;;
    "Knight 1") voice="Tarik" ;;
    "Fairy 2&3") voice="Veena" ;;
    "Princess 4") voice="Agnes" ;;
    "Princess 2") voice="Laila" ;;
    "Fairy 3") voice="Moira" ;;
    "Dragon King") voice="Bruce" ;;
    "Princess 3 & 4") voice="Aurelie" ;;
    "Knight 5") voice="Thomas" ;;
    "Knight 4") voice="Daniel" ;;
    "Knight 3") voice="Rishi" ;;
    "Knight 2") voice="Lee" ;;
    *) voice="Ava" ;;
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
      isActor="$(octosql --output csv "select actor from script2.csv where id = $i and actor = '$character'" | uniq | tail +2 | wc -l | tr -d ' ')"
      actor=$(octosql --output csv "select actor from script2.csv where id = $i" | uniq | tail +2)
      char=$(octosql --output csv "select character from script2.csv where id = $i" | uniq | tail +2)
      line=$(octosql --output csv "select line from script2.csv where id = $i" | uniq | tail +2)
      rate=$(octosql --output csv "select wpm from script2.csv where id = $i" | uniq | tail +2)
      # echo "$char"
      voice="$(voicePick "$char")"
      # echo "$voice"
      if [[ "$isActor" == "1" ]]; then
        echo "And You Say.."
        echo
        say -v "Ava" -r "120" "And You Say.."
        echo "        $line"
        sleep 5
        echo
      elif [[ "$actor" == "scene" ]]; then
        echo
        echo "        $line"
        say -v "$voice" -r "$rate" "$line"
        echo
      else
        echo
        echo "$char Speaking"
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
