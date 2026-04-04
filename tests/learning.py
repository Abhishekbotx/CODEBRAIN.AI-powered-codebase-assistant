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



