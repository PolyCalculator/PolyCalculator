import copy
import sequence
import sys


def better_solution(sol1, sol2):
    """Compares two solutions.
    
    Args:
      sol1: A solution returned by Sequence.status().
      sol2: A solution returned by Sequence.status().

    Returns:
      True if sol2 is better than sol1, False otherwise.
    """
    if (sol1[0] < sol2[0]):
        return False
    elif (sol1[1] < sol2[1]):
        return False
    elif (sol1[2] > sol2[2]):
        return False
    return True


def branch_and_bound(sequence):
    """Computes the optimal sequence of attackers.

    TODO:
    - Make this an actual branch-and-bound if enumeration is too long.

    Args:
      sequence: An unsolved Sequence object.

    Returns:
      A solved Sequence object.
    """
    queue = [sequence]
    best_score = (99, 99, -1)
    best_seq = None
    while len(queue) > 0:
        seq = queue.pop(0)
        status = seq.status()
        if (status is not None) and (better_solution(best_score, status)):
            best_score = status
            best_seq = seq
            continue
        else:
            branches = seq.unused_attackers()
            for i in branches:
                s = copy.deepcopy(seq)
                s.fight(i)
                queue.append(s)
    return best_seq


def main():
    """Computes the optimal sequence of attackers.
    
    This algorithm computes the optimal sequence of attacking
    units whose objectives are, in order, to:
    - Kill the defending unit,
    - Maximize the damage dealt to the defending unit,
    - Minimize the number of attacker casualties,
    - Minimize the cumulative damage taken by the attackers left alive.

    This function assumes that the input data is consistent.

    TODO:
    - Include the option for retaliation/non-retaliation.
    - Allow for multiple defenders. But this might be fairly complicated to
      input. Maybe not all attacking units are in range of all defending units.
      Or maybe a certain defending unit has to be killed first in order to allow
      some attacking units to then gain range on some other defending unit. There
      may be many such special situations. The output will only be as good as how
      finely-grained the input is.

    Args:
      Power of attacking unit 0, modifiers included.
      Current HP of attacking unit 0.
      Maximum HP of attacking unit 0.
      For attacking unit 0, retaliation (1) or not (0) from the defending unit.
      ...
      Power of attacking unit N, modifiers included.
      Current HP of attacking unit N.
      Maximum HP of attacking unit N.
      For attacking unit N, retaliation (1) or not (0) from the defending unit.
      Power of defending unit, modifiers included.
      Current HP of defending unit.
      Maximum HP of defending unit.
    
    Returns:
      Integers in range [0, N] indicating the optimal sequence
      of attacking units, according to the input order.
    """
    # Construct the list of units
    seq = sequence.Sequence(sys.argv[1])
    sol = branch_and_bound(seq)
    for i in sol._sequence:
        print(i, end=' ')
    print(sol._defender[1])
    sys.stdout.flush()


# The fun starts here:
main()
