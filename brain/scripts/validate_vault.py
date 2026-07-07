"""Validate the project-brain vault. Exit 1 on any error.

Usage: python brain/scripts/validate_vault.py [--quiet-warnings]
"""
import sys
import vaultlib


def main():
    notes, edges, errors, warnings = vaultlib.load_vault()
    if warnings and "--quiet-warnings" not in sys.argv:
        print("WARNINGS (%d):" % len(warnings))
        for w in warnings:
            print("  ~ " + w)
    if errors:
        print("ERRORS (%d):" % len(errors))
        for e in errors:
            print("  ! " + e)
        print("\nVALIDATION FAILED")
        sys.exit(1)
    print(vaultlib.stats(notes, edges))
    print("\nVALIDATION OK")


if __name__ == "__main__":
    main()
