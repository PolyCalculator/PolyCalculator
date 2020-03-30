import decimal
import json


class Sequence:
    def __init__(self, file_path):
        """Initialises the first Sequence object.

        Args:
          file_path: Path of the JSON file.
        """
        with open(file_path, 'r') as f:
            data = f.readline()
        f.close()
        data = json.loads(data)
        self._attackers = []
        for i in data['attackers']:
            new_attacker = []
            new_attacker.append(i['att'])
            new_attacker.append(i['currenthp'])
            new_attacker.append(i['maxhp'])
            new_attacker.append(i['retaliation'])
            self._attackers.append(new_attacker)
        self._defender = [data['defender']['def'] * data['defender']['bonus'], \
                          data['defender']['currenthp'], \
                          data['defender']['maxhp']]        
        self._sequence = []

        
    def fight(self, index):
        """Executes a new fight.

        The attacking unit at index 'index' fights the defender. Unit stats
        and the sequence are then updated.

        Args:
          index: The index of the attacking unit.
        """
        # Compute combat damage
        attacker = self._attackers[index]
        defender = self._defender
        atk_power = attacker[0]
        atk_hp = attacker[1]
        atk_maxhp = attacker[2]
        def_power = defender[0]
        def_hp = defender[1]
        def_maxhp = defender[2]
        accelerator = 4.5
        atk_force = atk_power*(atk_hp/atk_maxhp)
        def_force = def_power*(def_hp/def_maxhp)
        tot_dmg = atk_force + def_force
        atk_dmg_formula = (atk_force/tot_dmg)*atk_power*accelerator
        def_dmg_formula = (def_force/tot_dmg)*def_power*accelerator
        atk_dmg = float(decimal.Decimal(atk_dmg_formula)\
                        .quantize(0, decimal.ROUND_HALF_UP))
        def_dmg = float(decimal.Decimal(def_dmg_formula)\
                        .quantize(0, decimal.ROUND_HALF_UP))

        # Update unit stats
        defender[1] = max(0, defender[1]-atk_dmg)
        if (defender[1] > 0) and (attacker[3] == True):
            attacker[1] -= def_dmg
        self._attackers[index] = attacker
        self._defender = defender

        # Update sequence
        self._sequence.append(index)

        
    def status(self):
        """Checks the status of the sequence.

        Returns:
          - If the defender is dead, or if the sequence is full, tuple of:
            (defender hp, attacker casualties, cumulative attacker hp),
          - None otherwise.
        """
        if (self._defender[1] <= 0) or \
           (len(self._sequence) == len(self._attackers)):
            return (self._defender[1], \
                    sum([1 for x in self._attackers if x[1] <= 0]), \
                    sum([x[1] for x in self._attackers if x[1] >= 1]))        
        else:
            return None


    def unused_attackers(self):
        """Lists attackers which have not been used yet.

        Returns:
          Set of the indices of the attackers which have not been used yet.
        """
        return set([_ for _ in range(len(self._attackers))]).\
            difference(set(self._sequence))
