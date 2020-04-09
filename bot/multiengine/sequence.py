import decimal
import json


class Sequence:
    def __init__(self, file_path):
        """Initialises the first Sequence object.

        Args:
          file_path: Path of the JSON file.
        """
        testing = False    # True if I test with a local file
        data = -1
        if testing:
            with open(file_path, 'r') as f:
                data = json.load(f)
        else:
            data = json.loads(file_path)

        self.defender = {
            'defence': data['defender']['def'] * data['defender']['bonus'],
            'hp': data['defender']['currenthp'],
            'maxhp': data['defender']['maxhp'],
            'ranged': data['defender']['ranged']
        }

        self.attackers = []
        for i in data['attackers']:
            new_attacker = {}
            new_attacker['attack'] = i['att']
            new_attacker['hp'] = i['currenthp']
            new_attacker['maxhp'] = i['maxhp']
            # Retaliation logic: attacker[3] == True means that the attacker
            # takes damage, False means he does not take damage
            # Basic logic:
            #   - The defending unit always takes damage
            #   - The attacking unit, if melee, always takes damage (sometimes
            #     0 damage, e.g., Moonie)
            #   - The attacking unit, if ranged == True:
            #     - Does not take damage if the defending unit is melee
            #     - Takes damage if the defending unit is ranged
            # Overrides:
            #   - 'r': Force the attacking unit to take damage
            #   - 'nr': Prevent the attacking unit from taking damage
            #   - '': Use the default basic logic
            # Force damage
            if i['retaliationOverride'] == 'r':
                new_attacker['retaliation'] = True
            # Prevent damage
            elif i['retaliationOverride'] == 'nr':
                new_attacker['retaliation'] = False
            # Use default basic logic
            else:
                # Melee attacker
                if not i['ranged']:
                    new_attacker['retaliation'] = True
                # Ranged attacker
                else:
                    # Melee defender
                    if self.defender['ranged'] == False:
                        new_attacker['retaliation'] = False
                    # Ranged defender
                    elif self.defender['ranged'] == True:
                        new_attacker['retaliation'] = True
            self.attackers.append(new_attacker)

        self.sequence = []


    def fight(self, index):
        """Executes a new fight.

        The attacking unit at index 'index' fights the defender. Unit stats
        and the sequence are then updated.

        Args:
          index: The index of the attacking unit.
        """
        # Compute combat damage
        atk = self.attackers[index]
        dfn = self.defender    # def is a reserved keyword
        accelerator = 4.5
        atk_force = atk['attack'] * (atk['hp']/atk['maxhp'])
        def_force = dfn['defence'] * (dfn['hp']/dfn['maxhp'])
        tot_dmg = atk_force + def_force
        atk_dmg_formula = (atk_force/tot_dmg) * atk['attack'] * accelerator
        def_dmg_formula = (def_force/tot_dmg) * dfn['defence'] * accelerator
        atk_dmg = float(
            decimal.Decimal(atk_dmg_formula).quantize(0, decimal.ROUND_HALF_UP)
        )
        def_dmg = float(
            decimal.Decimal(def_dmg_formula).quantize(0, decimal.ROUND_HALF_UP)
        )

        # Update unit stats
        dfn['hp'] = max(0, dfn['hp']-atk_dmg)
        if dfn['hp'] > 0 and atk['retaliation']:
            atk['hp'] -= def_dmg

        # Update sequence
        self.sequence.append(index)


    def status(self):
        """Checks the status of the sequence.

        Returns:
          - If the defender is dead, or if the sequence is full, tuple of:
            (defender hp, attacker casualties, cumulative attacker hp),
          - None otherwise.
        """
        if (
                self.defender['hp'] <= 0
                or len(self.sequence) == len(self.attackers)
                ):
            return {
                'def_hp': self.defender['hp'],
                'dead': sum(1 for x in self.attackers if x['hp'] <= 0),
                'atk_hp': sum(x['hp'] for x in self.attackers if x['hp'] >= 1)
            }


    def unused_attackers(self):
        """Lists attackers which have not been used yet.

        Returns:
          Set of the indices of the attackers which have not been used yet.
        """
        return set(range(len(self.attackers))).difference(set(self.sequence))
