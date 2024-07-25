void main() {
  final fixedLengthList = List<int>.filled(5, 0); // Creates fixed-length list.
  print(fixedLengthList);

  fixedLengthList[0] = 87;
  print(fixedLengthList);

  fixedLengthList.setAll(1, [1, 2, 3]);
  print(fixedLengthList);

  final growableList = <String>['A', 'B'];
  growableList[0] = 'G';
}
