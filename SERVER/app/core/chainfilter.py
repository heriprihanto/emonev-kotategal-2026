class ChainFilter:
    def __init__(self):
        self.return_arr = []

    def chain_filter(self, filter_tree: dict):
        """
        Takes a defined filter tree dictionary and outputs a processed result.
        """
        arr = filter_tree['arr']
        if not self.is_assoc(arr):
            self.return_arr = arr  # root for return array
        else:
            self.return_arr = [arr]  # force a list to keep return consistent

        self.do_chain_filter(filter_tree['next_arrs'], self.return_arr)
        return self.return_arr

    def is_assoc(self, arr):
        """
        Check if a list is associative (like PHP arrays with string keys)
        In Python: dicts are associative, lists are not.
        """
        return isinstance(arr, dict)

    def do_chain_filter(self, tree_arr: list, final_arr: list):
        """
        Recursive function to build the chained structure
        """
        if not isinstance(final_arr, list):
            return False

        for f_idx, f_arr in enumerate(final_arr):
            cur_final_node = final_arr[f_idx]

            for n_arr in tree_arr:
                arr_label = n_arr['arr_label']

                # create the next final node
                next_final_node = self.children_of_parent(
                    cur_final_node,
                    n_arr['arr'],
                    n_arr['p_key'],
                    n_arr['c_key']
                )

                # attach children under the label key
                cur_final_node[arr_label] = next_final_node or []

                # recurse deeper if needed
                if n_arr.get('next_arrs'):
                    self.do_chain_filter(n_arr['next_arrs'], cur_final_node[arr_label])

    def children_of_parent(self, arr_parent: dict, arr_children: list, key_parent: str, key_child: str):
        """
        Takes a parent dict and a list of child dicts,
        returns only children belonging to the parent.
        """
        parent_id = arr_parent.get(key_parent)
        return_arr = []

        for child in arr_children:
            child_id = child.get(key_child)
            if child_id == parent_id:
                return_arr.append(child)

        return return_arr if return_arr else None
