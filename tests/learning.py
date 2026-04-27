#my learning file

""" 
# dirnames[:] = modifying contents of the box
# dirnames =   pointing to a new box entirely

original = ["node_modules", "src", ".git"]
ref = original          # ref points to same box

ref = ["src"]           # ref now points to new box, original unchanged
print(original)         # ["node_modules", "src", ".git"]  ← os.walk still sees this

ref = original          # reset
ref[:] = ["src"]        # modifies the box itself
print(original)         # ["src"]  ← os.walk sees this too    

"""



SKIP_DIRS = {"__pycache__", "node_modules", ".git", ".venv", "venv", "dist", "build"}
""" [d for d in dirnames if d not in SKIP_DIRS] """

"give me d,  for each d in dirnames,  but only if d is not in SKIP_DIRS"

""" [  d                        # 1. what to keep
    for d in dirnames           # 2. loop through every item
   if d not in SKIP_DIRS ]      # 3. condition — only include if true """  


# exact same thing as:
# result = []
# for d in dirnames:
#     if d not in SKIP_DIRS:
#         result.append(d)